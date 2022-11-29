const express = require('express');
const router = express.Router();
const Posts = require("../schemas/post.js");
///////////////////////////////////////////////////////////////////////////////
//Home
router.get("/", (req, res) => {
    res.send("Welcome to Ludin World");
  });

// 게시글 작성 API  
router.post("/posts", async (req, res) => {
  try{
	const {user,password,title,content} = req.body;
  const createdPosts = await Posts.create({user,password,title,content});
  res.json({"message": "게시글을 생성하였습니다."});
  }catch(err){
    res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.'});
    console.log(err)
  }
});

//게시글 조회 API 
router.get("/posts", async(req, res) => {
  const existsPost = await Posts.aggregate([{"$project": { "postId": "$_id", "user": "$user","title":"$title","createdAt":"$createdAt","_id":false }}])
	res.json({ data: existsPost});
});

//게시글 상세 조회 API
router.get('/posts/:postId',async(req,res)=>{
 
  const {postId} = req.params;
  const existsPost = await Posts.aggregate([{"$project": { "postId": "$_id", "user": "$user","title":"$title","content":"$content","createdAt":"$createdAt","_id":false }}])
  const [data] = existsPost.filter((posts) => String(posts.postId) === postId) //추후 질문 사함
  if(postId === null||postId===undefined){
    res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.'});
  }else if(data ===undefined) {
  res.status(400).json({"message": '없는 게시글입니다.'});
} else
	res.json({ data });

})
//게시글 수정 API
router.put('/posts/:postId',async(req,res)=>{
  
  try{const {postId} = req.params;
  const {password,title,content} = req.body;
  const existsPost = await Posts.find({ _id: postId });

  if(password===undefined||title===undefined||content===undefined||req.params===null||req.params===undefined){
    res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.'});
  }else if(!existsPost.length){
    res.status(404).json({"message": '게시글 조회에 실패했습니다.'});
  }else{
     await Posts.updateOne({_id: postId},{$set: {password,title,content}})
     res.json({ "message": "게시글을 수정하였습니다."}
     );}
  }catch(err){ 
    res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.(params error)'});
  }

})
//게시글 삭제 API
router.delete('/posts/:postId',async(req,res)=>{
  try{
  const {postId} = req.params;
  const {password} = req.body;
  const [existsPost] = await Posts.find({ _id: postId });

  if(password===undefined){   //비번이 바디에 없을 경우
    res.status(400).json({"message": '비밀번호를 입력해주세요'});
  }else if(existsPost===undefined){  //받은 파람스 조회 실패
    res.status(404).json({"message": '게시글 조회에 실패했습니다.'});
  }else if(existsPost.password !== password) //비번 틀렸을 경우
  res.status(400).json({"message": '비밀번호가 틀렸습니다.'});
  else  {
    await Posts.deleteOne({_id: postId})
    res.json({ "message": '게시글을 삭제하였습니다.'});
  }
}catch(err){
  res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.(params error)'});
}
})

module.exports = router;