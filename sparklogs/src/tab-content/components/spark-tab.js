
import React from 'react';
import axios from 'axios';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import 'antd/dist/antd.css';
import './../../index.css';
import { Button } from 'antd';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import { InfoCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';





/* https://ant.design/components/notification/ 
  used to pop up when a wrong clusterID or ApplicationID is given as input. */
const Notification = type => {
  notification[type]({
    message: 'Error',
    description:
      'Invalid Cluster ID or Application ID',
    duration: 10,
  });
}


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

/* Variable to set the initial state of the state object. */
const initialState = {
  loading: false, /* loading while waiting for response */
  asyncf: true,
  res: [], /* json response*/
  specificE: [], /* specific error*/
  specificW: [], /* specific warning */
  sparkcid: '', /* spark cluster id*/
  sparkaid: '', /* spark application id */
  logspath:'',
  keyword: '', /* keyword search*/
  requestNotComplete: true,
  sparkciderror: '', /* error in spark cluster id*/
  sparkaiderror: '',/* error in spark application id*/
  locationerror:'',
  exclusive: false, /* exclusive search from second page*/
  flag: 2, /* variable to check if file was uploaded to s3 when there was response limit. 
    flag=1 when file is uploaded to s3 else flag=0 when not uploaded. */
  keywordOutput: [], /* Keyword search output */
  filepath: '', /* filename in s3 that contains keyword search results that exceeds response limit. */
  resLen: 0,
  KeywordLen:0

}

class SparkForm extends React.Component {

  state = initialState; /* Setting the state with initialState variable */

  async makeHTTPrequest() {

    const params = {
      /* ClusterID, ApplicationID, Keywords for search, exclusive is a flag set to false when keyword is searched from first page.
      exclusive is set to true when keyword is searched from second keyword tab page. */
      cluster_id: this.state.sparkcid,
      application_id: this.state.sparkaid,
      keyword: this.state.keyword,
      logspath: this.state.logspath,
      exclusive: false
    };
    this.setState({ loading: true })
    console.log("fetching python localhost");
    await fetch("/Spark", {
      method:"POST",
      cache: "no-cache",
      headers:{
          "content_type":"application/json",
      },
       body:JSON.stringify(params)
      }
  ).then(response => {
   
    return response.json()
}).then((data) => {
    //const json = JSON.parse(data); 
    
    this.setState({
      res: data.res, specificE: data.SpecificError,
      specificW: data.SpecificWarn, flag: data.flag, loading: false,
      filepath: data.filepath,
      asyncf: true, keywordOutput: data.Keyword,
      loading: false,
      resLen: data.resLen,
      KeywordLen: data.KeywordLen
    });

    this.newPage()
})



}


  /* Function to validate the inputs given in the form */
  validate = () => {
    let sparkciderror = "";
    let sparkaiderror = "";
    let locationerror = "";
    let error = false;

    if (!this.state.sparkcid)/* Checking if Cluster ID was left empty */ {
      sparkciderror = "Please enter the Cluster ID";
    }
    if (!this.state.sparkaid)/* Checking if Application ID was left empty */ {
      sparkaiderror = "Please enter the Application ID.";
    }
    if (!this.state.logspath)/* Checking if Cluster ID was left empty */ {
      locationerror = "Please enter the Logs location";
    }
    if (sparkciderror || sparkaiderror || locationerror)/* If any of the required field is empty */ {
      this.setState({ sparkciderror, sparkaiderror, locationerror });
      error = true; /* set error to true*/
    }

    if (error) /* If error is true */ { return false; }

    return true;

  }

  /* Function is called when the submit button is clicked*/
  mySubmitHandler = event => {
    event.preventDefault();
   
    const isvalid = this.validate() /* calling validate() to check the form inputs */
    
    if (isvalid) { /* If form inputs were valid then make the HTTP request */
      
      this.makeHTTPrequest();
      

    }


  };

  /* Function to redirect to the SparkPage2 along with the json response. */
  newPage = event => {
    this.props.history.push({
      pathname: '/SparkPage2' , state: {
        data: this.state.res,
        specificE: this.state.specificE,
        specificW: this.state.specificW,
        cluster_id: this.state.sparkcid,
        application_id: this.state.sparkaid,
        keyword: this.state.keyword,
        flag: this.state.flag,
        keywordOutput: this.state.keywordOutput,
        filepath: this.state.filepath,
        logspath: this.state.logspath,
        resLen: this.state.resLen,
        KeywordLen: this.state.KeywordLen

      }
    })
    this.setState(initialState);

  };
  /* Function to record the change in the input field and setting the latest input given by the user. */
  myChangeHandler = event => {
    const nam = event.target.name;
    const val = event.target.value.trim();
    this.setState({ [nam]: val });

  };



  render() {
    return (
      <form >
        <fieldset>
          <legend className="required">
            <span className="number">1</span> Cluster ID
          </legend>
          <input /* Input for Cluster ID */
            type="text"
            name="sparkcid"
            className={this.state.sparkciderror ? "inputerror" : "inputdefault"}
            value={this.state.sparkcid}
            onChange={this.myChangeHandler}
          />

          <div /* to show error */ className="error">{this.state.sparkciderror}</div>
        </fieldset>
        <fieldset>
          <legend className="required">
            <span className="number">2</span> Application ID
          </legend>
          <input /* Input for Application ID */
            type="text"
            name="sparkaid"
            className={this.state.sparkaiderror ? "inputerror" : "inputdefault"}
            value={this.state.sparkaid}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.sparkaiderror}</div>
        </fieldset>
        <fieldset>
          <legend className="required">
            <span className="number">3</span> Logs location
            <Tippy className="info" content={<span>
              PLease enter the log location without the Cluster ID</span>}>
            <InfoCircleOutlined style={{padding: 4}}/>
            </Tippy>
          </legend>
          
          <input /* Input for Application ID */
            type="text"
            name="logspath"
            className={this.state.locationerror ? "inputerror" : "inputdefault"}
            value={this.state.logspath}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.locationerror}</div>
        </fieldset>

        <fieldset>

          <legend>
            <span className="number">4</span> Search By Keyword

            <Tippy /* Used for information hovering */
              className="info" content={<span>
                The application performs Auto Debugging.
                To search for specific keywords, please enter the keywords seperated by comma.
              Ex:Error, Fatal</span>}>
              <InfoCircleOutlined style={{ padding: 4 }} />
            </Tippy>
          </legend>
          <input /* Input for keyword search */
            type="text"
            name="keyword"
            className="inputdefault"
            placeholder="memory,terminated"
            value={this.state.keyword}
            onChange={this.myChangeHandler}
          />
        </fieldset>

        <Button id="submit" type="primary" onClick={this.mySubmitHandler}>
          Submit
        </Button>
        <br></br>
        <br></br>

        <BarLoader /* The loading component */
          css={override}
          size={2000}
          width={200}
          color={"lightblue"}
          loading={this.state.loading}
        />
      
      </form>

    );
  }
}

export default SparkForm;

