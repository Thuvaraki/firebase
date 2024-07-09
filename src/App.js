import { useState, useEffect } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  //New movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const moviesCollectionRef = collection(db, "movies");
  const [updateTitle, setUpdateTitle] = useState("");

  // file upload state
  const [fileUpload, setFileUpload] = useState(null);

  const getMoviesList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMoviesList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseData: newReleaseDate,
        receiverdAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMoviesList();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMoviesList();
    } catch (err) {
      console.log(err);
    }
  };

  const updateMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updateTitle });
      getMoviesList();
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `ProjectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release date"
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an oscar</label>
        <button onClick={onSubmitMovie}>Submit movies</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receiverdAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date : {movie.releaseData}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete button</button>
            <input
              placeholder="new  title"
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <button onClick={() => updateMovie(movie.id)}> update title</button>
          </div>
        ))}
      </div>

      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
