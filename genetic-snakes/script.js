"use strict";

import { ObservationType, ActionNames, SnakeApiV1 } from "./snake-api-toolbox.js"

// Call the function to execute the request
//const data = await spec();

//const data = await reset_many_combo([0], ObservationType.RawState, 4, "4test");
const data = await SnakeApiV1.step_many_combo([ActionNames.Straight, ActionNames.TurnLeft, ActionNames.TurnRight, ActionNames.Straight], "4test");

console.log(data);