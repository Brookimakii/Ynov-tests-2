import mysql.connector
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel

MY_SECRET = os.getenv("MY_SECRET")
ALGORITHM = os.getenv("ALGORITHM")

class Login(BaseModel):
    email: str
    password: str


class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    birthDate: str
    postalCode: str
    city: str


app = FastAPI()
origins = [
    "https://loise.github.io/",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello_world():
    return "Hello world"

conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    port=3306, 
    host=os.getenv("MYSQL_HOST"))
    
@app.get("/users")
async def get_users():
    # Create a connection to the database
    cursor = conn.cursor(dictionary=True)
    sql_select_Query = "select * from utilisateur"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    # renvoyer nos données et 200 code OK
    return records

@app.post("/users")
async def create_user(user: User):
    cursor = conn.cursor()
    try:
        # Check if email already exists
        check_email_query = "select id from utilisateur WHERE email = %s"
        cursor.execute(check_email_query, (user.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )
        
        # Insert new user
        insert_query = """
            INSERT INTO utilisateur (firstName, lastName, email, birthDate, postalCode, city)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            user.firstName,
            user.lastName,
            user.email,
            user.birthDate,
            user.postalCode,
            user.city
        ))
        conn.commit()
        
        return {
            "id": cursor.lastrowid,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "birthDate": user.birthDate,
            "postalCode": user.postalCode,
            "city": user.city
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
    finally:
        cursor.close()

@app.post("/login")
async def login(login: Login):
    cursor = conn.cursor()
    email = login.email
    password = login.password
    sql_select_Query = "select * from admin WHERE email=\""+ str(email) +"\" AND password=\""+ str(password)+"\";"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    if cursor.rowcount > 0:
        encoded_jwt = jwt.encode({'data': [{'email':email}]}, MY_SECRET, algorithm=ALGORITHM)
        return encoded_jwt
    else:
        raise Exception("Bad credentials")

@app.delete("/users")
async def deleteUser(id: str, authorization: Optional[str] = Header(None)):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme. Must be 'Bearer'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    try:
        # Décoder le jeton. PyJWT vérifie automatiquement la signature et l'expiration.
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])
        ##TODO delete user whith id
        return True
    except ExpiredSignatureError:
        print("Erreur : Le jeton JWT a expiré.")
        raise Exception("Bad credentials")
    except InvalidTokenError as e:
        print(f"Erreur : Le jeton JWT est invalide : {e}")
        raise Exception("Bad credentials")
    except Exception as e:
        print(f"Une erreur inattendue est survenue lors de la vérification du jeton : {e}")
        raise Exception("Bad credentials")
    