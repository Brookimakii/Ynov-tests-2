

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

load_dotenv()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(os.getenv("MYSQL_DATABASE"))
print(os.getenv("MYSQL_ROOT_PASSWORD"))
print(os.getenv("MYSQL_HOST"))


conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user="root",
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    host=os.getenv("MYSQL_HOST"),
    port=3306
)
    

@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    sql_select_Query = "SELECT * FROM utilisateur"
    cursor.execute(sql_select_Query)
    records = cursor.fetchall()
    print("Total number of rows in table: ", cursor.rowcount)
    return {"utilisateurs": records}
