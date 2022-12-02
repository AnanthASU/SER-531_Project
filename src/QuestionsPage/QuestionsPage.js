import React from 'react';
import "./QuestionsPage.css";


function QuestionsPage(props)
{

    const [res, setRes] = React.useState([]);
    const [display, setDisplay] = React.useState(null);
    React.useEffect(() => {
        const unloadCallback = (event) => {
          event.preventDefault();
          event.returnValue = "";
          return "";
        };
      
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, []);

    const testQuery = async(from_date, to_date, questions, lo, hi)=>  {
        let url = new URL("https://dbpedia.org/sparql");
        let params = {
            query: `
            SELECT distinct(?name)
            (group_concat(distinct ?actor; separator=",") as ?actors)
            (group_concat(distinct ?director; separator=",") as ?directors) ?gross ?release_date
            WHERE {
            ?uri rdf:type <http://dbpedia.org/ontology/Film>.
            ?uri rdfs:label ?name;
            <http://dbpedia.org/ontology/director> ?director;
            <http://dbpedia.org/ontology/starring> ?actor;
            <http://dbpedia.org/ontology/gross>?gross;
            <http://dbpedia.org/property/released> ?release_date.
            FILTER(?release_date >"${from_date}"^^xsd:date && ?release_date<"${to_date}"^^xsd:date)
            Filter(datatype(?gross) =<http://dbpedia.org/datatype/usDollar>)
            FILTER(lang(?name)="en")
            }
            ORDER BY DESC (?release_date)
            LIMIT ${questions}`,
        };
        url.search = new URLSearchParams(params).toString();
        let myHeaders = new Headers();
        myHeaders.append("Accept", "application/sparql-results+json");
        let requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
            await fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => displayResult(result, lo, hi))
            .catch((error) => displayError(error));
    }
    const displayError=(error)=> {
        console.log(error);
    }
    const displayResult=(data, lo, hi)=> {
        let temp = data.results.bindings;
        console.log(temp,"data", lo, hi);
            let filteredData = temp.filter(value=>value.gross.value >lo && value.gross.value < hi);
            console.log(res)
            setRes(filteredData);
            console.log(filteredData,"filteredData");
    }

    let lo,hi;
    let difficulty = props.apiResponse.difficultyValue;
    if(difficulty === 1){
        lo = 5e8; hi= 1e10;
    }else if(difficulty === 2){
        lo = 1e7; hi = 5e8;
    }else if(difficulty === 3){
        lo = 5e5; hi = 1e7;
    }else if(difficulty === 4){
        lo = 1e5; hi =5e5;
    }else{
        lo = 0; hi = 1e5;
    }

    React.useEffect(()=>
    {
        testQuery(props.apiResponse.fromValue, props.apiResponse.toValue, 10000, lo, hi);
    },[]);

    const handleQuestions=(key,idx)=> {
        const min = 1;
        const max = 4;
        const rand = min + Math.random() * (max - min);
        console.log(rand,'rand');
        if(Math.round(rand) == 1)
        {
            return (<div><p className="description">Who is the Actor starring in {key.name.value} directed by {key.directors.value.substring(key.directors.value.lastIndexOf('/') + 1)}?</p>
            <div className='answer-wrapper'><span onClick={()=>{alert("Answer-"  +key.name.value)}}>Click to Show the Answer</span></div></div>);
        }
        else if(Math.round(rand) == 2)
        {
            return (<div><p className="description">Who is the Director for this {key.name.value} starring {key.actors.value.substring(key.actors.value.lastIndexOf('/') + 1)}?</p>
            <div className='answer-wrapper'><span onClick={()=>{alert("Answer-"  +key.name.value)}}>Click to Show the Answer</span></div></div>);
        }
        else {
            return (<div><p className="description">In which movie does {key.actors.value.substring(key.actors.value.lastIndexOf('/') + 1)} starred, which is directed by {key.directors.value.substring(key.directors.value.lastIndexOf('/') + 1)} released in {key.release_date.value}?</p>
            <div className='answer-wrapper'><span onClick={()=>{alert("Answer-"  +key.name.value)}}>Click to Show the Answer</span></div></div>);
        }
      };
      

    return(
        <div id='Card-Wrapper'  className="Card-Wrapper">
            {res.slice(0,props.apiResponse.questionsValue).map((key,idx)=>
            <div className="card" onClick={()=>{setDisplay(idx)}}>
        <h3 className="title">Questions {idx+1}</h3>
        {handleQuestions(key,idx)}
      </div>
            )}
        </div>
    )
}

export default QuestionsPage;