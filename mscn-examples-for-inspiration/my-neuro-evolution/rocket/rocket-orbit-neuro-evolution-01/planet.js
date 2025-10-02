"use strict";

//import { Vector2 } from "./vector2.js";

class Planet {
    constructor(){
        this.pos = new Vector2();
        this.vel = new Vector2();
        this.frc = new Vector2();
        this.mass = 0.0;
        this.radius = 0.0;
    }
    update(){
        //this.vel = this.vel.add(this.frc.div(this.mass));
        this.vel = Vector2.add(this.vel, Vector2.div(this.frc, this.mass));
        //this.pos = this.pos.add(this.vel);
        this.pos = Vector2.add(this.pos, this.vel);
        this.frc = Vector2.mul(this.frc, 0);
    }
}

//export { Planet };