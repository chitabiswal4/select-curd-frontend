import React, {useState, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import userAnchorClientApi from '../../client-api/user-anchor';
import {Form, Button} from 'react-bootstrap';

const SelectCurd = () => {
  const check = sessionStorage.getItem('UserAnchor') !== null;
  const session_data = check
    ? JSON.parse(sessionStorage.getItem('UserAnchor') || {})
    : null;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(session_data);
  const [Label, setLabel] = useState([]);
  const [edit, setEdit] = useState(false);
  const [dataToBeChange, setDataChange] = useState();
  const [selected, isSelected] = useState(false);

  //geting data from the session storage using useEffect
  useEffect(() => {
    if (value !== null) {
      setDataChange(value.user_anchor);
    } else {
      setDataChange(null);
    }
  }, [value, setLoading]);

  //hendle onchange for select creatable form and saving the selected data to session storage
  const handleChange = (data) => {
    isSelected(true);
    sessionStorage.setItem('UserAnchor', JSON.stringify(data));
    setValue(data);
  };

  //creating new anchor and saving to the db
  const handleCreate = (data) => {
    setLoading(true);
    let d = {user_anchor: data};

    userAnchorClientApi.saveUserAnchor(d).then((res) => {
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
      await userAnchorClientApi.getAllUserAnchor().then((result) => {
        setData(result.data);
      });
    })();
  }, [loading, setLoading]);

  //passing an extra attribute named "label" to the array of obects as it needed by creatable components
  useEffect(() => {
    (async () => {
      let wdata = data.map((e) => {
        e.label = e.user_anchor;
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
    userAnchorClientApi.updateUserAnchorById(d).then((res) => {
      setValue(null);
      sessionStorage.setItem('UserAnchor', null);
      setLoading(false);
    });
  };

  //deleting the anchor from db
  const deleteAnchor = () => {
    setLoading(true);
    var d = {
      id: value._id,
    };
    userAnchorClientApi.deleteAnchorById(d).then((res) => {
      setValue(null);
      sessionStorage.setItem('UserAnchor', null);
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
              {' '}
              <Form id="my-form" onSubmit={updateAnchor}>
                <Form.Group>
                  <Form.Label>Edit Anchor</Form.Label>
                  <Form.Control
                    type="text"
                    name="component"
                    onChange={handleAnchorChange}
                    value={dataToBeChange}
                    placeholder="Edit Anchor"
                  />
                  <Form.Text className="text-muted">Edit the anchor</Form.Text>
                </Form.Group>
              </Form>{' '}
            </>
          ) : null}
        </div>
        {/* this is the creatable components with some basic inline css */}
        <div style={{width: '400px', margin: 'auto'}}>
          <div>
            <p>Select User Anchor</p>
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
            {selected && session_data && !edit ? (
              <>
                <Button variant="success" onClick={() => setEdit(true)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteAnchor()}>
                  confirm Delete
                </Button>
              </>
            ) : (
              <>
                {edit ? (
                  <>
                    <Button variant="success" form="my-form" type="submit">
                      save
                    </Button>
                    <Button variant="danger" onClick={() => setEdit(false)}>
                      cancel
                    </Button>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectCurd;
