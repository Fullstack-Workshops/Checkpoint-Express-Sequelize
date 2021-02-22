const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.belongsTo(Owner);
Owner.hasMany(Task);

Task.clearCompleted = async function() {
  return await this.destroy({
    where: {
      complete: true
    }
  })
};

Task.completeAll = async function() {
  return await this.update(
    { complete: true }, {
    where: {
      complete: false
    }
  })
};

Task.prototype.getTimeRemaining = function() {
  return !this.due ? Infinity : this.due - new Date();
};

Task.prototype.isOverdue = function() {
  let difference = this.due - new Date();
  return (difference < 0 && this.complete === false);
};

Task.prototype.assignOwner = function(owner) {
  return this.setOwner(owner)
}

Owner.getOwnersAndTasks = async function() {
  return await this.findAll({ include: [Task] })
}

Owner.prototype.getIncompleteTasks = async function() {
  let tasks = await this.getTasks();
  return tasks.filter((task) => task.complete === false)
}

Owner.beforeDestroy((owner) => {
  if (owner.name === 'Grace Hopper') {
    throw Error('An owner cannot have the name Grace Hopper!');
  }
})
//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
