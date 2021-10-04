import React from "react";
import Grid from '@mui/material/Grid';
import Typography from "@material-ui/core/Typography";

import NavBar from "./NavBar/NavBar";
import DifficultyCard from "./DifficultySelection/DifficultyCard";

function HomePage() {

  return (
    <div>
      <NavBar/>
      <br/><br/>
        <div>
          <div >
            <h1 style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '5vh', fontWeight: "Bold", fontFamily: "Gabriola", color: "GrayText"}}>
              Choose your difficulty level
            </h1>
            <h2 style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '5vh', textAlign: "center", fontFamily: "Gabriola"}}>
              Based on your difficulty level, you will be assigned a question of the selected difficulty, <br/>
              and you'll be matched with another user who has selected the same difficulty level!
            </h2>
          </div>
          <br/><br/>
          <div>   
          <div style = {{display: "flex", justifyContent: "center"}}>
                <DifficultyCard difficulty = {"Easy"}/>&emsp;
                <DifficultyCard difficulty = {"Medium"}/>&emsp;
                <DifficultyCard difficulty = {"Hard"}/>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default HomePage;