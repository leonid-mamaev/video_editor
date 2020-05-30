FROM python:3.7-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get -y install ffmpeg

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src src

CMD python ./src/app.py
