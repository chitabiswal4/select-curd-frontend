import React, {useState, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import AnchorClientApi from '../../client-api/anchor';
import {Form, Button} from 'react-bootstrap';

const SelectCurd = () => {
  const check = sessionStorage.getItem('Anchor') !== null;
  const session_data = check
    ? JSON.parse(sessionStorage.getItem('Anchor') || {})
    : null;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(session_data);
  const [Label, setLabel] = useState([]);
  const [edit, setEdit] = useState(false);
  const [dataToBeChange, setDataChange] = useState();
  const [selected, isSelected] = useState(false);
  const [IsDelete, SetDelete] = useState(false);

  //geting data from the session storage using useEffect
  useEffect(() => {
    if (value !== null) {
      setDataChange(value.anchor);
    } else {
      setDataChange(null);
    }
  }, [value, setLoading]);

  //hendle onchange for select creatable form and saving the selected data to session storage
  const handleChange = (data) => {
    isSelected(true);
    sessionStorage.setItem('Anchor', JSON.stringify(data));
    setValue(data);
  };

  //creating new anchor and saving to the db
  const handleCreate = (data) => {
    setLoading(true);
    let d = {anchor: data};

    AnchorClientApi.saveAnchor(d).then((res) => {
      setLoading(false);
    });
  };

  //handle ooChange function for edit data form
  const handleAnchorChange = (e) => {
    setDataChange(e.target.value);
  };

  //getting all data from db
  useEffect(() => {
    (async () => {
      await AnchorClientApi.getAllAnchor().then((result) => {
        setData(result.data);
      });
    })();
  }, [loading, setLoading]);

  //passing an extra attribute named "label" to the array of obects as it needed by creatable components
  useEffect(() => {
    (async () => {
      let wdata = data.map((e) => {
        e.label = e.anchor;
        return e;
      });

      setLabel(wdata);
    })();
  }, [data]);

  //updating the anchor value in the DB
  const updateAnchor = (e) => {
    e.preventDefault();
    setLoading(true);
    setEdit(false);
    const d = {
      id: value._id,
      data: dataToBeChange,
    };
    AnchorClientApi.updateAnchorById(d).then((res) => {
      var sd = {
        _id: res.data.data._id,
        anchor: res.data.data.anchor,
        __v: res.data.data.__v,
        label: res.data.data.anchor,
      };
      setValue(sd);
      sessionStorage.setItem('Anchor', JSON.stringify(sd));
      setLoading(false);
    });
  };

  //deleting the anchor from db
  const deleteAnchor = (e) => {
    e.preventDefault();
    setLoading(true);
    SetDelete(false);
    var d = {
      id: value._id,
    };
    AnchorClientApi.deleteAnchorById(d).then((res) => {
      setValue(null);
      sessionStorage.setItem('Anchor', null);
      setLoading(false);
      setEdit(false);
    });
  };

  return (
    <div>
      <div>
        <div style={{width: '400px', margin: 'auto'}}>
          {/* this is the form where we can update the value this will appear when we click on the edit button by setEdit(true) */}
          {edit && session_data ? (
            <>
              <Form id="edit-form" onSubmit={updateAnchor}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="component"
                    onChange={handleAnchorChange}
                    value={dataToBeChange}
                    placeholder="Edit Anchor"
                  />
                </Form.Group>

                <Button
                  variant="success"
                  style={{margin: '5px'}}
                  form="edit-form"
                  type="submit"
                >
                  save
                </Button>

                <Button variant="danger" onClick={() => setEdit(false)}>
                  cancel
                </Button>
              </Form>
            </>
          ) : null}

          {IsDelete && session_data ? (
            <>
              {' '}
              <Form id="delete-form" onSubmit={deleteAnchor}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="components"
                    value={dataToBeChange ? dataToBeChange : ''}
                    placeholder="Edit Anchor"
                    disabled
                  />
                </Form.Group>
                <Button
                  variant="danger"
                  style={{margin: '5px'}}
                  form="delete-form"
                  type="submit"
                >
                  confirm delete
                </Button>
                <Button variant="success" onClick={() => SetDelete(false)}>
                  cancel
                </Button>
              </Form>
            </>
          ) : null}
        </div>
        {/* this is the creatable components with some basic inline css */}
        <div style={{width: '400px', margin: 'auto'}}>
          <div>
            <p>Select Anchor</p>
            <CreatableSelect
              maxMenuHeight={200}
              isClearable
              isDisabled={false}
              isLoading={loading}
              onChange={handleChange}
              onCreateOption={handleCreate}
              options={data}
              value={value}
            />
          </div>
          <div>
            {selected && session_data && !edit && !IsDelete ? (
              <>
                <Button
                  variant="success"
                  style={{margin: '5px'}}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => SetDelete(true)}>
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectCurd;
