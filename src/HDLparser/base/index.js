

// merge all base package into base module
module.exports = Object.assign({}, 
    require('./common'), 
    require('./module')
);