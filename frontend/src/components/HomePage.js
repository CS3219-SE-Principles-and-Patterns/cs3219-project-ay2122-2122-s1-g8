import React from "react";
import Grid from '@mui/material/Grid';

import NavBar from "./NavBar/NavBar";
import DifficultyCard from "./DifficultySelection/DifficultyCard";

function HomePage() {

  const difficulties = ["test"]//["Easy", "Medium", "Hard"]

  return (
    <div>
      <NavBar/>
      <h1>Choose your difficulty level</h1>
      <h2>Based on your difficulty level, you will be assigned a question of the selected difficulty, and you'll be matched with another user who has selected the same!</h2>
      <br/><br/>
      <div style={{alignItems: "center"}}>      
        {difficulties.map((row, i) => (
          <Grid container spacing={50}>
          <Grid item xs={2}>
            <DifficultyCard/>
          </Grid>
          <Grid item xs={2}>
            <DifficultyCard/>
          </Grid>
          <Grid item xs={2}>
            <DifficultyCard/>
          </Grid>
        </Grid>
        ))}
      </div>
    </div>
  );
}

export default HomePage;