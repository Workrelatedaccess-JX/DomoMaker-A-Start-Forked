const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Domo form logic
// start with preventDefault to stop the default form submission behavior,
// stop the page from reloading,
// so custom logic will handle the form submission
const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    // with default prevented, get the name and age values from the form inputs
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    if (!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age }, onDomoAdded);
    return false;
};

// Domo form format in the maker page,
// with name and age input fields and a submit button
// when called, it will make the page for domo form.
const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

// Domo list format in the maker page,
// with a list of domos and their names and ages displayed
// when called, it will make the page for domo list.
const DomoList = (props) => {

    // useState() allows React to remember information and 
    // update the webpage when that information changes.
    const [domos, setDomos] = useState(props.domos);

    // useEffect() allows React to run code after the component has been rendered.
    // In this case, it runs the code to load the domos from the server 
    // when the component is first rendered and whenever the reloadDomos prop changes.
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]); // useEffect trigger

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    // Map over the domos array and create a div for each domo with its name and age displayed
    const domoNodes = domos.map((domo, index) => {
        return (
            <div key={index} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

// The main App component that renders the DomoForm and DomoList components
const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;