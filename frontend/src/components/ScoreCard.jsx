function ScoreCard({score,risk}){

  const color =
    risk === "Low"
      ? "green"
      : risk === "Medium"
      ? "orange"
      : "red";

  return(

    <div style={{
      border:"1px solid gray",
      padding:"20px",
      margin:"20px",
      width:"300px"
    }}>

      <h2>Financial Health Score</h2>

      <h1>{score}</h1>

      <p style={{color:color}}>
        Risk Level: {risk}
      </p>

    </div>

  );

}

export default ScoreCard;