from fastapi import FastAPI

app = FastAPI(title="Resume Bank API")


@app.get("/")
async def read_root():
    return {"message": "Resume Bank API"}
