from sqlalchemy import Column, Integer, String
from database import Base


class Workouts(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    muscle = Column(String)
    sets = Column(Integer)
    repetition = Column(Integer)
