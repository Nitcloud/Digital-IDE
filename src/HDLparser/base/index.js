

// merge all base package into base module
module.exports = Object.assign({}, 
    require('./constant'), 
    require('./marco'), 
    require('./module')
);