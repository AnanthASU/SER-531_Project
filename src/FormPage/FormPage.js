import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './FormPage.css';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

export default function FormPage(props) {

    const [fromValue, setFromValue] = React.useState(null);
    const [toValue, setToValue] = React.useState(null);
    const [difficultyValue, setDifficultyValue] = React.useState(2);
    const [open, setOpen] = React.useState(false);
    const [category, setCategory] = React.useState('Select');
    const [questionsValue, setQuestionaValue] = React.useState(10);
    const history = useHistory();

    const handleChange = (event) => {
        setCategory(event.target.value);
        console.log(category,"categ");
      };

    const handleClose = () => {
        setOpen(false);
      };

      const handleOpen = () => {
        setOpen(true);
      };

      const handleQuestionsChange = event => {
        setQuestionaValue(event.target.value);
      };

      const ConvertDate=(date)=>
      {
        if(parseInt(date) > 9)
        {
          return date;
        }
        else{
          return "0"+date;
        }
      }
      const handleSubmit=(e)=>
    {

      if(toValue != null && fromValue != null && category != null && questionsValue != 'Select')
      {
        // e.preventDefault();
        console.log(toValue.get('date'));
        const formattedToDate = toValue.get('year')+"-"+toValue.get('month')+"-"+ConvertDate(toValue.get('date'));
        const formattedFromDate = fromValue.get('year')+"-"+fromValue.get('month')+"-"+ConvertDate(fromValue.get('date'));
        //make post api call.
        const userInput = {toValue:formattedToDate,fromValue:formattedFromDate,difficultyValue:difficultyValue, category:category, questionsValue:questionsValue};
        props.handleApiResponse(userInput);
        history.push("/QuestionsPage");
      }
      else{
        alert("Please fill all the fields!");
        console.log("alert");
      }
    };
  return (
    <React.Fragment>
      <Grid className="Form-Container" container spacing={3}>
      <div className="Title" >
        Trivia Quiz
      </div>
        <Grid className="Form-Elements" item xs={12} md={6}>
        <div className="From-Label" component="legend">Please Select From Date</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="From Date"
        value={fromValue}
        onChange={(newValue) => {
          setFromValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="To Date"
        value={toValue}
        onChange={(newValue) => {
          setToValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
    
        </Grid>
        <Grid  className="Form-Elements" item xs={12} md={6}>
        <div className="From-Label" component="legend">Please Select Movie Genre</div>
        <Select
        style={{width:"200px"}}
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={category}
          onChange={handleChange}
        >
          <MenuItem value={"Action"}>Action</MenuItem>
          <MenuItem value={"Comedy"}>Comedy</MenuItem>
          <MenuItem value={"Romance"}>Romance</MenuItem>
          <MenuItem value={"Thriller"}>Thriller</MenuItem>
          <MenuItem value={"Horror"}>Horror</MenuItem>
        </Select>
        </Grid>
        <Grid className="Form-Elements" item xs={12} md={6}>
        <div className="From-Label" component="legend">Please Enter Number of Questions</div>
          <TextField
            required
            id="number_of_questions"
            label="Number of Questions"
            fullWidth
            variant="standard"
            onChange={handleQuestionsChange}
            value={questionsValue}
          />
        </Grid>
        <Grid className="Form-Elements" item xs={12} md={6}>
        <div className="From-Label" component="legend">Please Select Dificulty Rating</div>
      <Rating
      size="large"
        name="simple-controlled"
        value={difficultyValue}
        onChange={(event, newValue) => {
            setDifficultyValue(newValue);
        }}
      />
        </Grid>
        <Grid className="Form-Elements" item xs={12} md={6}>
        <Button className="Button-Elements" variant="outlined" size="large" onClick={()=>{handleSubmit()}}>Submit</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}