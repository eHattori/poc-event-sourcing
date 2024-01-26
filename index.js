const express = require('express');

const app = express();
app.use(express.json());


let events = [];

app.post('/events', (req, res) => {
  const event = {
    eventType: req.body.eventType,
    data: req.body.data,
    timestamp: new Date(),
  };

  events.push(event);
  res.status(201).send(event);
});

app.get('/state', (req, res) => {
  const state = rebuildState(new Date(req.query.date));
  res.send(state);
});

function rebuildState(date) {
  let state = { user: 'Hattori', structs: [] };
  const relevantesEvents = events.filter(el => new Date(el.timestamp) <= date).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  relevantesEvents.forEach((el) => {
    switch(el.eventType){
      case "AddStruct": 
        if(!state.structs.includes(el.data.struct)){
          state.structs.push(el.data.struct);
        }
        break;
      case "RemoveStruct":
        state.structs = state.structs.filter((st) => st !== el.data.struct);
        break;
      default:
        console.log('EventType Not found');
    }
  });
   return state;
}

app.listen(3000, () => {
  console.log('Server Running');
})
