//@input Component.ScreenTransform Bottle
//@input Component.VFXComponent Sparks
//@input SceneObject TopHoney
//@input Asset.Material TopHoneyMaterial
//@input Component.ScriptComponent splashScript

//@input SceneObject DropsParent
//@input Asset.ObjectPrefab Drop

//@input SceneObject BottomHoney
//@input Asset.Material BottomHoneyMaterial

//@input SceneObject[] BottleDrops
//@input SceneObject[] Drops
//@input bool DanceDrops
//@input SceneObject HoneyDripsTop
//@input SceneObject Hair
//@input SceneObject SoundOn
//@input SceneObject Lyrics
//@input SceneObject Reset
//@input SceneObject Back
//@input vec2[] LinesTime

//@input SceneObject HintFlipCamera
//@input SceneObject[] FrontCameraObjects
//@input Component.AudioComponent MusicSource

script.BottomHoney.enabled = false
script.TopHoney.enabled = false

var canShowSoundUp = true
var bottleObj = script.Bottle.getSceneObject();
var bottleBody = script.Bottle.getSceneObject().getChild(1);
var dropletsHidden = 0;
var canFlip = false
var isFront = true;
var spawn = false;

global.touchSystem.touchBlocking = true;

function Init(){
    
    script.MusicSource.stop(false);
    script.SoundOn.getTransform().setLocalScale(new vec3(0,0,0));
    resetLyrics();
    script.Bottle.anchors.setCenter(new vec2(-0.6,1.4))
    script.Bottle.getSceneObject().getChild(0).getTransform().setLocalScale(new vec3(0,0,0));
    
    script.HintFlipCamera.getTransform().setLocalScale(new vec3(0,0,0));
    script.Reset.enabled = false;
    canFlip = false;
    enableParticles(false);
    
    
    
    script.BottomHoney.enabled = true
    script.TopHoney.enabled = true
    
    
    for(var i =0 ; i < script.BottleDrops.length;i++){
        script.BottleDrops[i].getTransform().setLocalScale(new vec3(0,0,0));
        script.BottleDrops[i].getComponent("Component.Image").mainPass.baseColor = new vec4(1, 1, 1, 1);
        
        script.Drops[i].getTransform().setLocalScale(new vec3(0,0,0));
    }
    dropletsHidden = 0;
    spawn = false;
}

function Start(){
    script.MusicSource.play(1);
    
    ShowSoundUp();
    StartKaraoke();
    BottleAnim();
   
    
    delayedReset.reset(30.5);
}

var Spawner = script.createEvent("DelayedCallbackEvent");
Spawner.bind(function(eventData)
{
    if(spawn){
        script.Drop.instantiate(script.DropsParent);
    }
    Spawner.reset(2+Math.random() * 2);
});
Spawner.reset(2+Math.random() * 2);

function Update(){
    //Do not put everything in one Big block devide itto functions so its more clean and clear to read
}

function resetLyrics(){
    for(var i = 0;i < script.Lyrics.getChildrenCount();i++)
        script.Lyrics.getChild(i).getTransform().setLocalScale(new vec3(0,0,0));
}

function ShowSoundUp(){
    if(canShowSoundUp){
        global.tweenManager.startTween(script.SoundOn,"Show",function(){
            global.tweenManager.startTween(script.SoundOn,"Hide");
        });
        canShowSoundUp = false;
    }
}

function StartKaraoke(){
    for(var i = 0;i < script.Lyrics.getChildrenCount();i++)
        ShowLine(script.Lyrics.getChild(i),script.LinesTime[i])
        
  
}

function ShowLine(line,time){
    var delayedShow = script.createEvent("DelayedCallbackEvent");
    delayedShow.bind(function(eventData)
    {
        global.tweenManager.startTween(line,"Show",function(){
            var delayedHide = script.createEvent("DelayedCallbackEvent");
            delayedHide.bind(function(eventData)
            {
                global.tweenManager.startTween(line,"Hide");
            });
            delayedHide.reset(time.y);
        });
    });
    delayedShow.reset(time.x);
}

function BottleAnim(){
    
    
    global.tweenManager.startTween(bottleObj.getChild(0),"Show",function(){
           
            global.tweenManager.startTween(bottleObj.getChild(0),"Hide");
    });
    
    global.tweenManager.startTween(bottleObj,"Drop",function(){
           
        
        var pnt = script.Bottle.position;
        var pnt2 = new vec2(pnt.x, pnt.y);
       
        pnt2 = script.Bottle.localPointToScreenPoint(pnt2);
        pnt2.x *= -1;
        pnt2.x = 1 - pnt2.x;
        print("BottleAnim: DoSplash : "+pnt2);
        script.splashScript.api.DoSplashAtPos(pnt2);
        
        global.tweenManager.startTween(bottleObj,"Move To Head",function(){
            for(var i =0 ; i < script.BottleDrops.length;i++)
                ShowDrop(i);
            
            global.tweenManager.startTween(bottleBody,"Rotate To Normal");
            
          
            
        })
        global.tweenManager.startTween(bottleBody,"Rotate To Head");
        
    });
    global.tweenManager.startTween(script.TopHoney,"Show",function(){
        spawn = true;
    });
    global.tweenManager.startTween(script.BottomHoney,"Show");
}

function ShowDrop(id){
    var drop = script.BottleDrops[id];
    global.tweenManager.startTween(drop,"Show");
    global.tweenManager.startTween(drop,"Move");
    global.tweenManager.startTween(drop,"Hide",null,function(){
        if(id == 2){
            script.Hair.enabled = false;
        }
        global.tweenManager.startTween(script.Drops[id],"Show");
        global.tweenManager.startTween(script.Drops[id],"Move",function(){
            dropletsHidden++;
            
            script.Drops[id].getChild(0).getComponent("Component.ScriptComponent").enabled = script.DanceDrops;
            global.tweenManager.startTween(script.Drops[id],"Hide",function(){
                checkToHideBottle();
            },function(){
                script.Drops[id].getChild(0).getComponent("Component.ScriptComponent").enabled = false;
            });
        });
    });
}

function checkToHideBottle(){
    if(dropletsHidden == 3){
        dropletsHidden++
        global.tweenManager.startTween(bottleObj,"Move Out");  
        
    }
}

var delayedReset = script.createEvent("DelayedCallbackEvent");
delayedReset.bind(function(eventData)
{
    Init();
    script.Reset.enabled = true;
    if(isFront){
        
         enableParticles(true);
            var delayedHidePartical = script.createEvent("DelayedCallbackEvent");
            delayedHidePartical.bind(function(eventData)
            {
                enableParticles(false);
            });
            delayedHidePartical.reset(2);
        
        global.tweenManager.startTween(script.HintFlipCamera,"Show",function(){
            canFlip = true;
        });  
    }
    
});

function resetPressed(){
    spawn = false;
    global.tweenManager.startTween(script.TopHoney,"Hide",function(){
        
    });
    global.tweenManager.startTween(script.BottomHoney,"Hide");
    
    script.HintFlipCamera.enabled = false;
    script.Reset.enabled = false;
    script.Hair.enabled = true;
    Start();
}

function enableParticles(b){
    script.Sparks.asset.properties["kill"] = !b;
}

var event = script.createEvent("CameraBackEvent");
event.bind(function (eventData)
{
    isFront = false;
    script.Back.enabled = true;
    script.HintFlipCamera.getComponent("Component.Image").enabled = false;
    if(canFlip){
        //activateBack
    }
    for(var i = 0; i < script.FrontCameraObjects.length;i++){
        script.FrontCameraObjects[i].enabled = false;
    }
});

var event0 = script.createEvent("CameraFrontEvent");
event0.bind(function (eventData)
{
    isFront = true;
    script.Back.enabled = false;
    script.HintFlipCamera.getComponent("Component.Image").enabled = true;
    for(var i = 0; i < script.FrontCameraObjects.length;i++){
        script.FrontCameraObjects[i].enabled = true;
    }
});

var eventUpdate = script.createEvent("UpdateEvent");
eventUpdate.bind(Update);

script.ResetPressed = resetPressed;

Init();
Start();

