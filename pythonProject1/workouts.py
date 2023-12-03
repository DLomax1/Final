from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
origins = [
     "http://localhost:3000",
 ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],

)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Workout(BaseModel):
    id: int = Field()
    name: str = Field(min_length=1)
    muscle: str = Field(min_length=1)
    sets: int = Field(gt=-1, lt=101)
    repetition: int = Field(gt=-1, lt=101)


WORKOUTS = []


@app.get("/")
def read_api(db: Session = Depends(get_db)):
    return db.query(models.Workouts).all()


@app.post("/")
def create_workout(workout: Workout, db: Session = Depends(get_db)):
    workout_model = models.Workouts(
        name=workout.name,
        muscle=workout.muscle,
        sets=workout.sets,
        repetition=workout.repetition
    )
    db.add(workout_model)
    db.commit()
    db.refresh(workout_model)
    return workout_model


@app.put("/{workout_Id}")
def update_workout(workout_id: int, workout: Workout, db: Session = Depends(get_db)):
    counter = 0
    workout_model = db.query(models.Workouts).filter(models.Workouts.id == workout.id).first()

    if workout_model is None:
        raise HTTPException(
            status_code=404,
            detail=f"ID {workout_id} : Does not exist"
        )
    workout_model.id = workout.id
    workout_model.name = workout.name
    workout_model.muscle = workout.muscle
    workout_model.sets = workout.sets
    workout_model.repetition = workout.repetition
    db.add(workout_model)
    db.commit()


@app.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    counter = 0

    workout_model = db.query(models.Workouts).filter(models.Workouts.id == workout_id).first()

    if workout_model is None:
        raise HTTPException(
            status_code=404,
            detail=f"ID {workout_id} : Does not exist"
        )

    db.query(models.Workouts).filter(models.Workouts.id == workout_id).delete()
    db.commit()