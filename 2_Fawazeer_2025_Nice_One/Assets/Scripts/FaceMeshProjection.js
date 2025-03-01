// -----JS CODE-----
// @input Component.RenderMeshVisual faceMesh
// @input Component.Camera camera

var isIntialized = validateAndSetInputs();
var mesh;

function onUpdate() {
    if(isIntialized){
        mesh.snap(script.camera);
    }
}


function validateAndSetInputs() {
    if(!script.faceMesh) {
        print("ERROR: Please assign the face mesh to the script.");
        return false;
    }
    
    if(!script.camera) {
        print("ERROR: Please assign the camera to the script.");
        return false;
    }
    

    mesh = getDuplicatedMesh(script.faceMesh);
    resetTransform(mesh);
 
    return true;
}

function getDuplicatedMesh(meshViz) {
    var meshObject = meshViz.getSceneObject();
    var duplicatedObject = meshObject.getParent().copyWholeHierarchy(meshObject);
    duplicatedObject.enabled = false;
    return duplicatedObject.getComponent("Component.RenderMeshVisual");
}

function resetTransform(meshViz) {
    var meshTrans = meshViz.getTransform();
    meshTrans.setLocalPosition(vec3.zero());
    meshTrans.setLocalRotation(quat.quatIdentity());
    meshTrans.setLocalScale(vec3.one());
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);