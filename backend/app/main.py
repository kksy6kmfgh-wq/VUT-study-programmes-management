from fastapi import FastAPI

app = FastAPI(
    title="VUT Study Programme Management",
    description="API pro řízení životního cyklu studijních programů VUT",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "name": "VUT Study Programme Management",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {"status": "ok"}