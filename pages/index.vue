<template>
  <div class="container">
    <div class="content">
      <Logo />
      <h1 class="title">roomservice + vue.js demo</h1>
      <input
        placeholder="Add a todo &amp; hit enter..."
        @keyup.enter="addTodo"
      />
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          <input
            :checked="todo.completed"
            type="checkbox"
            @change="toggle(todo)"
          />
          <span :class="{ done: todo.completed }">{{ todo.text }}</span>
        </li>
      </ul>
    </div>
    <Footer />
  </div>
</template>
<script>
import { RoomService } from '@roomservice/browser'
import cuid from 'cuid'
// eslint-disable-next-line no-unused-vars
const updateTodosArray = ({ index, ...rest }, todos) =>
  [].concat(todos.slice(0, index), { index, ...rest }, todos.slice(index + 1))

const start = async () => {
  const service = new RoomService({
    auth: '/api/my-roomservice',
  })
  const room = await service.room('monthly-planner')
  const list = room.list('todays-todo-list')
  return {
    room,
    list,
  }
}

export default {
  data() {
    return {
      room: {},
      list: {},
      todos: [],
    }
  },
  async beforeMount() {
    const service = await start()
    const { room, list } = await service

    this.room = room
    this.list = list
    this.todos = this.list.toArray()

    room.subscribe(this.list, (newList) => {
      console.log('updated connected list')
      this.todos = newList.toArray()
    })
  },
  mounted() {},
  methods: {
    toggle(todo) {
      const updatedTodo = { ...todo, completed: !todo.completed }
      this.list.set(todo.index, updatedTodo)
      this.todos = updateTodosArray(updatedTodo, this.todos)
    },
    addTodo(e) {
      const newTodo = {
        text: e.target.value,
        index: this.todos.length,
        id: cuid(),
        completed: false,
      }
      e.target.value = ''
      this.list.push(newTodo)
      this.todos.push(newTodo)
    },
  },
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  font-size: 16px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: #35495e;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.done {
  text-decoration: line-through;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 48px;
  color: #35495e;
  letter-spacing: 1px;
}

.content {
  flex: 1;
}

input {
  font-size: 16px;
  border: 2px solid #35495e;
  border-radius: 5px;
  padding: 0.25rem;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

svg {
  max-height: 100px;
}

ul {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.links {
  padding-top: 15px;
}
</style>
