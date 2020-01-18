
## git操作接口

```js
// 我本地服务 172.16.110.223:9090 调用前和我说下 我起下服务
// 目前本地调试使用http, 上线后使用https
// base_url
http://${base_host}:${base_port}/git/v1
```

#### 创建仓库(创建项目)
```js
${base_url}/project/add

eg:

request.post({
  url:'${base_url}/project/add',
  headers: {
    cookie: "SSO_USER_TOKEN=p_d3c9c91e8d822fe2238f6af7326xxc96"
  },
  body:JSON.stringify({
    projectName: "test-create-repo",
    templateId: 3037 // 此id 我这边暂时会写死，如果以后有多套模板，可以开放
  })
},(err, res, body) => {
  if (err) {
    throw err
  }
  console.log(body)
})

```

#### 新增文件
```js
${base_url}/file/add

eg:

const fileinfo = `## this is a readme file generate by api
- [ ] todo1 
- [ ] todo2 
- [ ] todo3 
- [x] done1
- [x] done2
- [x] done3
- [x] done4
`
let params = JSON.stringify({
    projectId: 4907, // 上一步创建项目返回的id
    filename: 'README.md', // 如果要修改 src/views/a.vue 传 src/views/a.vue即可
    file: fileinfo, // 文件字符串
    commitMessage: "first commit, modify readme markdown file",
})

request.post('${base_url}/file',{
    headers:{
        "Content-Type": "application/json",
        cookie: "SSO_USER_TOKEN=p_d3c9c91e8d822fe2238f6axx3261ac96"
    },
    body: params
},(err, res, body) => {
    assert.equal(err, null)
    console.log(body)
})
```


#### 修改文件
```js
${base_url}/file/update 
数据结构与新增文件相同，接口调用使用put方法

eg: 

let params = JSON.stringify({
    projectId: 4907, // 上一步创建项目返回的id
    filename: 'README.md', // 如果要修改 src/views/a.vue 传 src/views/a.vue即可
    file: fileinfo, // 文件字符串
    commitMessage: 'update file',
})

request.put('${base_url}/file/update',{
    headers:{
        "Content-Type": "application/json",
        cookie: "SSO_USER_TOKEN=p_d3c9c91e8d822fe2238f6axx3261ac96"
    },
    body: params
},(err, res, body) => {
    assert.equal(err, null)
    console.log(body)
})
 
```  
#### 拉取单个文件模板
```js
${base_url}/file/export

let params = JSON.stringify({
  projectId: 4907, // 要拉取文件位于哪个仓库
  filename: '2.vue', // 如果要修改 src/views/a.vue 传 src/views/a.vue即可
})

request.put('${base_url}/file/export',{
    headers:{
        "Content-Type": "application/json",
        cookie: "SSO_USER_TOKEN=p_d3c9c91e8d822fe2238f6axx3261ac96"
    },
    body: params
},(err, res, body) => {
    assert.equal(err, null)
    console.log(body)
})
```



























## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

