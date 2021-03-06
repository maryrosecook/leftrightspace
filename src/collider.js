;(function(exports) {
  var Collider = function() {
  };

  Collider.prototype = {
    collideRecords: [],

    update: function() {
      var ent = game.entityer.entities;
      for (var i = 0, len = ent.length; i < len; i++) {
        for (var j = i; j < len; j++) {
          if (ent[i] !== ent[j]) {
            if (game.maths.circlesIntersecting(ent[i], ent[j])) {
              this.addNewCollision(ent[i], ent[j]);
            } else {
              this.removeOldCollision(ent[i], ent[j]);
            }
          }
        }
      }
    },

    addNewCollision: function(entity1, entity2) {
      if (this.getCollideRecord(entity1, entity2) === undefined) {
        this.collideRecords.push([entity1, entity2]);
        if (entity1.collision !== undefined) {
          entity1.collision(entity2);
        }

        if (entity2.collision !== undefined) {
          entity2.collision(entity1);
        }
      }
    },

    removeEntity: function(entity) {
      this.removeOldCollision(entity);
    },

    // if passed entities recorded as colliding in history record, remove that record
    removeOldCollision: function(entity1, entity2) {
      var recordId = this.getCollideRecord(entity1, entity2);
      if (recordId !== undefined) {
        var record = this.collideRecords[recordId];
        if (record[0].uncollision !== undefined) {
          record[0].uncollision(record[1]);
        }

        if (record[1].uncollision !== undefined) {
          record[1].uncollision(record[0]);
        }

        this.collideRecords.splice(recordId, 1);
      }
    },

    getCollideRecord: function(entity1, entity2) {
      for (var i = 0, len = this.collideRecords.length; i < len; i++) {
        // looking for coll where one entity appears
        if (entity2 === undefined &&
            (this.collideRecords[i][0] === entity1 ||
             this.collideRecords[i][1] === entity1)) {
          return i;
        // looking for coll between two specific entities
        } else if (this.collideRecords[i][0] === entity1 &&
                   this.collideRecords[i][1] === entity2) {
          return i;
        }
      }
    }
  };

  exports.Collider = Collider;
})(this);
