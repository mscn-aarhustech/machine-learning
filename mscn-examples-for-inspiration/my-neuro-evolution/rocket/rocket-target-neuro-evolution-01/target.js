"use strict";

class Target {
    constructor(){
        this.pos = new Vector2(200 + Math.random() * (width - 400 ), 200 + Math.random() * (height - 400 ));
        this.vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).mul(0.5);
        this.frc = new Vector2();
        this.mass = 10.0;
        this.radius = 20.0;
    }
    update(){
        //this.vel = this.vel.add(this.frc.div(this.mass));
        this.vel = Vector2.add(this.vel, Vector2.div(this.frc, this.mass));
        //this.pos = this.pos.add(this.vel);
        this.pos = Vector2.add(this.pos, this.vel);
        this.frc = Vector2.mul(this.frc, 0);
    }
}