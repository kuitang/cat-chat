FROM python:3.15.0-slim-trixie
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade "pip>=26.2.0" "setuptools>=83.0.0" "wheel>=0.46.2" && pip install --no-cache-dir --require-hashes -r requirements.txt
# Package installers are build-only; keep the production runtime free of their vendored libraries.
RUN /usr/local/bin/python -m pip uninstall -y pip setuptools wheel
COPY backend.py .
EXPOSE 8080
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "8080"]