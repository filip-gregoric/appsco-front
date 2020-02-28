import '@polymer/polymer/polymer-legacy.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

/**
 * @polymerBehavior
 */
export const AppscoDropHTMLElementBehavior = {

    properties: {},

    dragEnter: function(event) {
        event.stopPropagation();
        this.className = this.className + ' dropover';
    },

    dragLeave: function(event) {
        event.stopPropagation();
        this.className = this.className.replace(' dropover', '');
    },

    dragOver: function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    },

    drop: function(event) {
        var dragItem = event.dataTransfer.getData('dragItem'),
            dropElement = dom(this.root).querySelector('[data-drop-to-zone]');

        event.stopPropagation();
        dropElement.className = dropElement.className.replace(' dropover', '');

        if (dragItem) {
            this.dispatchEvent(new CustomEvent('item-dropped', {
                bubbles: true,
                composed: true,
                detail: {
                    item: JSON.parse(dragItem)
                }
            }));
        }
        else {
        }
    },

    initializeDropBehavior: function() {
        var dropElements = dom(this.root).querySelectorAll('[data-drop-to-zone]');

        if (dropElements && 0 < dropElements.length) {
            var length = dropElements.length;

            for (var i = 0; i < length; i++) {
                var dropElement = dropElements[i];

                dropElement.addEventListener('dragenter', this.dragEnter, false);
                dropElement.addEventListener('dragleave', this.dragLeave, false);
                dropElement.addEventListener('dragover', this.dragOver, false);
                dropElement.addEventListener('drop', function(event) {
                    this.drop(event);
                }.bind(this), false);
            }
        }
    }
};
