/* GopherGfx App Template
 * CS 4388/ CS 5388, Fall 2024, Texas State University
 * Instructor: Isayas Berhe Adhanom <isayas@txstate.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private ground: gfx.Mesh3;
    private skybox: gfx.Mesh3;
    private sphere: gfx.Mesh3;

    private sphereStartPosition: gfx.Vector3;
    private sphereEndPosition: gfx.Vector3;

    private sphereStartColor: gfx.Color;
    private sphereEndColor:gfx.Color;

    private sphereAlpha: number;
    private lerpDirection: number;

    // --- Create the App class ----
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.ground = gfx.Geometry3Factory.createBox(50,1,50);
        this.skybox = gfx.Geometry3Factory.createBox(100,100,100);
        this.sphere = gfx.Geometry3Factory.createSphere(0.5);

        this.sphereStartPosition = new gfx.Vector3(-5,3,-10);
        this.sphereEndPosition = new gfx.Vector3(5,3,-10);

        this.sphereStartColor = new gfx.Color(1,1,0);
        this.sphereEndColor = new gfx.Color(0,1,1);

        this.sphereAlpha = 0;
        this.lerpDirection = 1;
    
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 100);
        this.camera.position.set(0,1.6,0);

        this.ground.position.set(0,-0.5,0);
        this.ground.material.setColor(new gfx.Color(83/255, 209/255, 110/255));

        //create ambient light to add uniform and constant lighting to everything in the scene
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.4,0.4,0.4));

        //create directional light that is infinitely far away like sunlight
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.6,0.6,0.6));
        directionalLight.position.set(1,2,1);

        this.skybox.material = new gfx.UnlitMaterial();
        this.skybox.material.side = gfx.Side.BACK;
        this.skybox.material.setColor(new gfx.Color(0.698,1,1));
        

        // this.sphere.position.copy(this.sphereStartPosition);

        this.sphere.position.lerp(this.sphereStartPosition, this.sphereEndPosition, this.sphereAlpha);
       
        
        this.scene.add(this.ground);
        this.scene.add(ambientLight);
        this.scene.add(this.skybox);
        this.scene.add(this.sphere);
        this.scene.add(directionalLight);
        
    }
    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        const lerpSpeed = 0.5; //how much should slpha change per second


        this.sphereAlpha += lerpSpeed * deltaTime * this.lerpDirection;

        if (this.sphereAlpha > 1 || this.sphereAlpha < 0 ){
            this.lerpDirection *= -1;
        }

        this.sphereAlpha = gfx.MathUtils.clamp(this.sphereAlpha, 0, 1);

        this.sphere.position.lerp(this.sphereStartPosition, this.sphereEndPosition, this.sphereAlpha);

        const sphereColor = gfx.Color.lerp(
            this.sphereStartColor,
            this.sphereEndColor,
            this.sphereAlpha
        );

        this.sphere.material.setColor(sphereColor);
    }
}