FROM python:3.11-alpine

WORKDIR /app

COPY ./requirements.txt .

COPY ./script/main.py .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

# ENTRYPOINT ["uvicorn", "server:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
ENTRYPOINT ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]