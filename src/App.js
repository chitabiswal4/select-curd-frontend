import React from 'react';
import SelectAnchorList from './components/select/index';
import 'bootstrap/dist/css/bootstrap.css';
function App() {
  return (
    <div className="App">
      <SelectAnchorList anchorType={'UserAnchor'} />
      <SelectAnchorList anchorType={'DomainAnchor'} />
      <SelectAnchorList anchorType={'FlowAnchor'} />
    </div>
  );
}

export default App;
