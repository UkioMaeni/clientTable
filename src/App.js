import { create, deleted, read, update } from "./http/httpReq";
import "./App.css";
import Header from "./component/Header/Header";
import Body from "./component/Body/Body";
import { useEffect, useState } from "react";
import { cellTableSlice } from "./store/reducers/cellTableReducer";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const { setList, editPage, editSort } = cellTableSlice.actions;
  const { list, page, count, cellFilter, typeFilter, valueFilter, sort } =
    useSelector((state) => state.cellTableReducer);
  const dispatch = useDispatch();

  //////////////////////////обновление данных по изменению useState( реагирует на изменение, как следствие отправляет данные на сервер)
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    read(cellFilter, typeFilter, valueFilter, page, sort).then((e) =>
      dispatch(
        setList({
          list: e.data.list,
          count: e.data.count,
          filter: e.data.filter,
        })
      )
    );
  }, [edit]);

  ////////////////////функции управления страницей и сортировки данных////////
  function setPage(page) {
    dispatch(editPage(page));
  }
  function sortList(param) {
    dispatch(editSort(param));
  }
  ////////////////////функции CRUD запросов////////
  function createList() {
    create().then((e) => dispatch(setList(e.data)));
  }

  function deleteList(param) {
    deleted(param).then((e) => {
      if (e.data === "ok") {
        setEdit(!edit);
      }
    });
  }

  function updateList(id, timeT, nameT, countT, distanceT) {
    update({ id, timeT, nameT, countT, distanceT });
  }

  return (
    <div className="App">
      <Header setEdit={setEdit} edit={edit} />
      <Body
        list={list}
        createList={createList}
        deleteList={deleteList}
        page={page}
        count={count}
        edit={edit}
        setEdit={setEdit}
        setPage={setPage}
        sort={sort}
        sortList={sortList}
        updateList={updateList}
      />
    </div>
  );
}

export default App;
