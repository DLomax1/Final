// App.js
import React, { useState, useEffect } from 'react';
import api from './api';
import './App.css'; // Import your CSS file

const App = () => {
    const [workouts, setWorkouts] = useState([]);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        muscle: '',
        sets: '',
        repetition: '',
    });
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const fetchWorkouts = async () => {
        const response = await api.get('/');
        setWorkouts(response.data);
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (selectedWorkout) {
            await api.put(`/${selectedWorkout.id}`, formData);
        } else {
            await api.post('/', formData);
        }

        fetchWorkouts();
        clearForm();
    };

    const handleEdit = (workout) => {
        setSelectedWorkout(workout);
        setFormData(workout);
    };

    const handleCancelEdit = () => {
        setSelectedWorkout(null);
        clearForm();
    };

    const clearForm = () => {
        setFormData({
            id: 0,
            name: '',
            muscle: '',
            sets: '',
            repetition: '',
        });
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/${formData.id}`, formData);
            fetchWorkouts();
            clearForm();
        } catch (error) {
            console.error('Error updating workout:', error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/${id}`);
            fetchWorkouts();
            clearForm();
        } catch (error) {
            console.error('Error deleting workout:', error.message);
        }
    };

    return (
        <div>
            <nav className='navbar navbar-dark bg-primary'>
                <div className='container-fluid'>
                    <a className='navbar-brand' href='#'>
                        Fitness Tracker App
                    </a>
                </div>
            </nav>

            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 form-container'>
                        <form onSubmit={handleFormSubmit}>
                            <div className='mb-3 mt-3'>
                                <label htmlFor='Id' className='form-label'>
                                    Id
                                </label>
                                <input
                                    type='number'
                                    className='form-control'
                                    id='id'
                                    name='id'
                                    onChange={handleInputChange}
                                    value={formData.id}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='Name' className='form-label'>
                                    Name
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='name'
                                    name='name'
                                    onChange={handleInputChange}
                                    value={formData.name}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='Muscle' className='form-label'>
                                    Muscle Group
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='muscle'
                                    name='muscle'
                                    onChange={handleInputChange}
                                    value={formData.muscle}
                                />
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='Sets' className='form-label'>
                                    Sets
                                </label>
                                <input
                                    type='number'
                                    className='form-control'
                                    id='sets'
                                    name='sets'
                                    onChange={handleInputChange}
                                    value={formData.sets}
                                />
                            </div>

                            <div className='mb-3 '>
                                <label htmlFor='Reps' className='form-label'>
                                    Reps
                                </label>
                                <input
                                    type='number'
                                    className='form-control'
                                    id='repetition'
                                    name='repetition'
                                    onChange={handleInputChange}
                                    value={formData.repetition}
                                />
                            </div>

                            <button type='submit' className='btn btn-primary'>
                                {selectedWorkout ? 'Update' : 'Submit'}
                            </button>
                            {selectedWorkout && (
                                <button
                                    type='button'
                                    className='btn btn-secondary ms-2'
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                    <div className='col-md-6 table-container'>
                        <table className={'table table-striped table-bordered table-hover'}>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Muscle Group</th>
                                <th>Sets</th>
                                <th>Reps</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {workouts.map((workout) => (
                                <tr key={workout.id}>
                                    <td>{workout.id}</td>
                                    <td>{workout.name}</td>
                                    <td>{workout.muscle}</td>
                                    <td>{workout.sets}</td>
                                    <td>{workout.repetition}</td>
                                    <td>
                                        <button
                                            type='button'
                                            className='btn btn-info btn-sm me-2'
                                            onClick={() => handleUpdate(workout)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type='button'
                                            className='btn btn-danger btn-sm'
                                            onClick={() => handleDelete(workout.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
