import React from 'react';

var n=0; /* Variable used to determine the tab number HBase=0, Hive=1, Spark=2. By default set HBase tab to default. 
While redirecting to first web page, it will set the last visited tab as the current tab and not the default tab. */

/* Component to be rendered for tabs and takes arguments to set the active tab and change of tab.*/
const TabButtons = ({ buttons, changeTab, activeTab }) => (
  <div className="tab-buttons">
    {buttons.map(button => (
      <button
        className={button === activeTab ? 'active' : ''}
        onClick={() => changeTab(button)}/* Change the tab content when some other tab is clicked*/
      >
        {button}
      </button>
    ))}
  </div>
);

class Tabs extends React.Component {
  /* Function for setting the title of the web UI*/
  componentDidMount() { 
    document.title = 'EMR Debugging Script';
  }
  /* State object*/
  state = {
   
    activeTab: this.props.children[n].props.label, /* Keeps the active Tab label. Variable n determines the tab number. */
  };
  
  /* Function to change the active tab to the selected tab. */
  changeTab = tab => {
    
    this.setState({ activeTab: tab});

  };

  render() {
    let content = '';
    const buttons = [];

    return (
      <div>
        {React.Children.map(this.props.children, child => {
          /* Displaying the three tabs. If the label is same as the state object activetab, then assign content with that tab. */

          buttons.push(child.props.label);
          /* Condition check for determining active tab*/
          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}
         
        {React.Children.map(this.props.children, child => {
          /* Setting the Variable n with the active tab number. 
          So that when back button from second page is clicked, the previous tab becomes the current tab */
          if (child.props.id ==="0" && child.props.label === this.state.activeTab)
          {
            n=0; /*For HBase n=0 */
          }
          if (child.props.id ==="1" && child.props.label === this.state.activeTab)
          {
            n=1; /*For Hive n=1 */
          }
          if (child.props.id ==="2" && child.props.label === this.state.activeTab)
          {
            n=2; /*For Spark n=2 */
          }
        })}
        
        <TabButtons /*Component described above */
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

export default Tabs;
