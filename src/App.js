import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [actors, setActors] = useState({
    loading: true,
    columns: [
      {
        name: "Name",
        selector: (row) => row.name,
      },
      {
        name: "Height",
        selector: (row) => row.height,
      },
      {
        name: "Hair Color",
        selector: (row) => row.hair_color,
      },
      {
        name: "Skin Color",
        selector: (row) => row.skin_color,
      },
      {
        name: "Birth Year",
        selector: (row) => row.birth_year,
      },
      {
        name: "Gender",
        selector: (row) => row.gender,
      },
    ],
  });

  //Geting Data

  useEffect(() => {
    async function getAllData() {
      await fetch("https://swapi.dev/api/people/", {
        method: "GET",
      })
        .then((jsonData) => jsonData.json())
        .then((data) => {
          setActors({ ...actors, data: data.results, loading: false });
          let array = [];
          data.results.forEach((moviesArray) => {
            moviesArray.films.forEach((movieLink) => {
              if (array.indexOf(movieLink) === -1) {
                array.push(movieLink);
              }
            });
          });
          return array;
        })
        .then((array) => setMovies(array))
        .then(() => {
          Promise.all([
            movies.map(async (movieLink) => {
              return await fetch(movieLink, { method: "GET" }).then((resp) => resp.json());
            }),
          ]).then((answer) => {
            const ExpandedComponent = React.FC<ExpanderComponentProps<DataRow>> = ({ data }) => {
              return <pre>{JSON.stringify(data, null, 2)}</pre>;
            };
          });
        })
        .catch((e) => console.log(e));
    }
    getAllData();
  }, []);

  async function handleChange(e) {
    setSearch(e.target.value);
  }

  async function handleSearch(e) {
    setActors({ ...actors, loading: true });
    await fetch("https://swapi.dev/api/people/?search=" + search, { method: "GET" })
      .then((jsonData) => jsonData.json())
      .then((data) => {
        setActors({ ...actors, data: data.results });
      })
      .catch((e) => console.log(e));
  }

  return (
    <div className="App">
      {actors.loading ? "Cargando..." : null}
      <input type="text" placeholder="Search..." onChange={(e) => handleChange(e)}></input> <button onClick={() => handleSearch()}>Search.</button>
      <DataTable columns={actors.columns} data={actors.data} pagination expandableRows />
    </div>
  );
}

export default App;
