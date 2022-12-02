FROM nikolaik/python-nodejs:python3.11-nodejs19

COPY . /app
RUN cd /app && npm install
RUN pip install -r /app/animegan/requirements.txt
EXPOSE 3000
CMD ["node", "/app/server.js"]