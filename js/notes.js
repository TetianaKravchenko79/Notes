import React from "react";
import Swal from "sweetalert2";
import { APP, appConfig } from "./config.js";
import "firebase/firestore";
import Flatpickr from "react-flatpickr";

export default class NotesDialog extends React.Component {
  constructor(props) {
    super(props);

    this.handleNote = this.handleNote.bind(this);
    this.clickCreateNote = this.clickCreateNote.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.sortCategoryTop = this.sortCategoryTop.bind(this);
    this.sortCategoryBottom = this.sortCategoryBottom.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.makeLogout = this.makeLogout.bind(this);
    this.reload = this.reload.bind(this);
    this.DB = null;

    this.state = {
      notes: [],

      categories: [],

      createName: "",
      createCategoryId: "1",

   
      uid: this.props.uidMain,
      datecreate: new Date().toLocaleDateString("en-GB"),

      showOnlyDate: false,
    };
  }

  componentDidMount() {
    appConfig();

    this.DB = APP.firestore();

    this.listCategories();
  }

  reload() {
    this.setState({
      categories: [],
    });
    this.listCategories();
  }

  handleDate(selectedDates, dateStr, instance) {
    this.setState({ datecreate: dateStr });
  }

  listCategories() {
    let self = this;

    let categories = this.DB.collection("Categories").get();

    let arrCategories = [];
    categories.then((responce) => {
      responce.forEach((document) => {
        let category = document.data();
        category.id = document.id;

        console.log(category);

        arrCategories.push(category);
      });

      console.log(arrCategories);

      self.setState({
        categories: arrCategories,
      });

      self.listNotes();
    });
  }

  sortCategoryTop() {
    this.setState({
      notes: this.state.notes.sort(this.compareTop),
    });
  }

  compareTop(a, b) {
    if (a.categoryId + a.name < b.categoryId + b.name) {
      return -1;
    }
    if (a.categoryId + a.name > b.categoryId + b.name) {
      return 1;
    }

    return 0;
  }

  sortCategoryBottom() {
    let notes = this.state.notes.sort(this.compareTopName);

    this.setState({
      notes: notes.sort(this.compareBottom),
    });
  }

  compareTopName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }

  compareBottom(a, b) {
    if (a.categoryId > b.categoryId) {
      return -1;
    }
    if (a.categoryId < b.categoryId) {
      return 1;
    }

    return 0;
  }

  listNotes() {
    let self = this;

    let notes = this.DB.collection("Notes")
      .where("userId", "==", this.state.uid)
      .get();

    this.pushNotes(notes);
  }

  getCategoryName(categoryId) {
    let categories = this.state.categories;
    for (let i = 0; i < categories.length; ++i) {
      if (categories[i].id == categoryId) {
        return categories[i].name;
      }
    }
  }

  handleNote(event) {
    this.setState({
      createName: event.target.value,
    });
  }

  categoryChange(event) {
    this.setState({
      createCategoryId: event.target.value,
    });
  }

  clickCreateNote() {
    if (this.state.createName) {
      let createData = {
        name: this.state.createName,
        categoryId: this.state.createCategoryId,
        userId: this.state.uid,
        datecreate: this.state.datecreate,
      };

      this.DB.collection("Notes").add(createData);

      this.setState({
        createName: "",
        createCategoryId: "1",
        datecreate: new Date().toLocaleDateString("en-GB"),
      });

      this.listNotes();
    } else {
      Swal.fire({
        icon: "error",
        text: "Field Title must be filled in!",
      });
    }
  }

  clickRemoveNote(id) {
    this.DB.collection("Notes").doc(id).delete();

    setTimeout(() => {
      this.listNotes();
    }, "200");
  }

  listNotesCategory(id) {
    var self = this;

    let notes = this.DB.collection("Notes")
      .where("categoryId", "==", id)
      .where("userId", "==", this.state.uid)
      .get();

    this.pushNotes(notes);
  }

  pushNotes(notes) {
    var self = this;

    let arrNotes = [];
    notes.then((responce) => {
      responce.forEach((document) => {
        console.log(document.data());

        let note = document.data();
        note.id = document.id;

        note.categoryName = self.getCategoryName(note.categoryId);

        console.log(note);

        arrNotes.push(note);
      });

      console.log(arrNotes);

      self.setState({
        notes: arrNotes,
      });
    });
  }
  makeLogout() {
    this.props.handleLogoutMain();
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-2 text-right">
          <button className="btn btn-link" onClick={this.makeLogout}>
            Logout
          </button>
        </div>
        <div className="col-md-8 col-sm-6 col-xs-12">
          <div id="myDIV" className="header">
            <h2>My Notes List</h2>
            <div className="row">
              <div className="col-md-2">
                <Flatpickr
                  className="w-100"
                  value={this.state.datecreate}
                  onChange={this.handleDate}
                  options={{
                    dateFormat: "d/m/Y",
                  }}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="mySelect w-100"
                  value={this.state.createCategoryId}
                  onChange={this.categoryChange}
                >
                  {this.state.categories.map((item, key) => (
                    <option key={key} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="w-100"
                  id="myInput"
                  placeholder="Title..."
                  value={this.state.createName}
                  onChange={this.handleNote}
                />
              </div>
              <div className="col-md-2">
                <span className="addBtn w-100" onClick={this.clickCreateNote}>
                  Add
                </span>
              </div>
            </div>
            <div className="row">
              {this.state.categories.map((item, key) => (
                <div className="col myRadio" key={key}>
                  <input
                    type="radio"
                    name="rd"
                    onClick={() => {
                      this.listNotesCategory(item.id);
                    }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <button className="btn btn-link" onClick={this.sortCategoryTop}>
              sort category top
            </button>
            <button className="btn btn-link" onClick={this.sortCategoryBottom}>
              sort category bottom
            </button>
            <button className="btn btn-link" onClick={this.reload}>
              Reload from categories
            </button>
          </div>

          <div>
            <ul id="myUL">
              {this.state.notes.map((item, key) => (
                <li key={key}>
                  <b>{item.categoryName}</b> {item.name} {item.datecreate}
                  {(item.categoryId == 3 || item.categoryId == 4) && (
                    <span
                      className="close"
                      onClick={(e) => {
                        this.clickRemoveNote(item.id);
                        e.preventDefault();
                      }}
                    >
                      ×
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    );
  }
}
