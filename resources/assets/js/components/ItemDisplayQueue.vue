<template>
    <div class="items">
        <full-screen-queue-item
            v-for="(item, index) in items"
            :item="item"
            :index="index"
            :active="index == activeItem"
            :key="item.id"
            v-on:done="handleItemDone"
        >
        </full-screen-queue-item>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // Start with no active item
                activeItem: null,
                items: [],
            }
        },

        mounted() {
            // Once component is mounted, hit the API to fetch Items to display
            this.fetchItems();
        },

        methods: {
            fetchItems () {
                console.log('--> ItemDisplayQueue queue', this.items);
                console.log('--> ItemDisplayQueue fetching items');
                this.$http.get('queue').then((response) => {
                    console.log('response', response);
                    // Update the queue with the fetched items
                    this.updateQueue(response.data.data);
                }, (response) => {
                    // Something went wrong
                    console.log('error fetching items');
                    console.log(response);
                });
            },

            updateQueue (fetchedItems) {
                console.log('updateQueue', this.items, fetchedItems);
                // API delivers "queue" items
                // We extract all the "item" objects
                for (let fetchedEntry in fetchedItems) {
                    let fetchedItem = fetchedItems[fetchedEntry].attributes.item;

                    // Mark each Item as "seen" because it was seen in the
                    // API response. Afterwards we will remove all Items
                    // that were not "seen" as we know they've been removed
                    fetchedItem.seen = true;

                    // Check if the fetched item is already in the active
                    // display queue
                    let itemFound = false;
                    for (let queueEntry in this.items) {
                        let queueItem = this.items[queueEntry];
                        // This queue item is already in the queue
                        if (queueItem.id === fetchedItem.id) {
                            // If the fetched item is more up to date, we
                            // should replace the item in the queue
                            if (queueItem.updated_at < fetchedItem.updated_at) {
                                this.items[queueEntry] = fetchedItem;
                            } else {
                                // Mark the item as seen
                                queueItem.seen = true;
                            }

                            itemFound = true;
                            break;
                        }
                    }

                    // If the item was found in the current list, no need
                    // to add it
                    if (itemFound) {
                        continue;
                    }

                    // Add the item fetched from the server to the display
                    // queue
                    this.items.push(fetchedItem);
                }

                // Examine each item in the queue, removing items that were
                // not seen in the last update from the server, and reset
                // seen flag and component while we're iterating through
                for (let j = 0; j < this.items.length; j++) {
                    let item = this.items[j];
                    if (item.seen) {
                        item.component = 'item-' + item.type;
                        delete(item.seen);
                    } else {
                        // Remove the item that wasnt in the fetch from the
                        // server, and set j back by one so we don't skip an
                        // item
                        this.items.splice(j--, 1);
                    }
                }

                // If this is the first fetch, we should set the first item
                // to active
                if (this.activeItem === null) {
                    console.log('Starting activeItem at 0');
                    this.$nextTick(function() {
                        this.activeItem = 0;
                    });
                }
            },

            handleItemDone (itemId, itemDetails) {
                console.log('handleItemDone', itemId, this.items[this.activeItem].id);
                if (itemId === this.items[this.activeItem].id) {
                    this.next();
                }
            },

            // Used by child Items to trigger an advance to the next Item
            next () {
                let nextActiveItem = (this.activeItem >= this.items.length - 1) ? 0 : (this.activeItem + 1);
                console.log('nextActiveItem', nextActiveItem);

                // Periodically refresh the queue from the server
                if (nextActiveItem === 0) {
                    // Only attempt to fetch when we go back to the start, as
                    // item indexes may change
                    this.fetchItems();
                }

                // Only update this.activeItem once sync is complete or the
                // current activeItem could be removed
                if (this.activeItem !== nextActiveItem) {
                    this.activeItem = nextActiveItem;
                } else {
                    // There is only one item in the list, we do this to force
                    // an update so that the 'next' method keeps getting called
                    this.activeItem = null;
                    this.$nextTick(function() {
                        this.activeItem = 0;
                    });
                }
            }
        },
    }
</script>
