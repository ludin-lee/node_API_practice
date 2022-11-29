const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment.js")
///////////////////////////////////////////////////////////////////////////////
//댓글 생성 API
router.post("/comments/:postId", async (req, res) => {
 try{
  const {postId} = req.params;
	const {user,password,content} = req.body;
  const createdPosts = await Comments.create({postId,user,password,content});
  res.json({"message": "댓글을 생성하였습니다."});
 }catch(err){
  const {postId} = req.params;
	const {user,password,content} = req.body;
  if(postId===undefined||user===undefined||password===undefined){
    res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."});
  }
  if(content===undefined||content===null){
    res.status(400).json({"message": "댓글 내용을 입력해주세요."});
  }
 }
});
//댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  try{
  const {postId} = req.params;
  const existsComments = await Comments.aggregate([{"$project": { "commentId": "$_id", "user": "$user","content":"$content","createdAt":"$createdAt","postId":"$postId","_id":false }}])  //find로 바꾸자
  const data = existsComments.filter((comments) => String(comments.postId) === postId) //추후 질문 사함
  
  
  for( i in data){    // postId 제거
    delete data[i].postId
  }

  res.json({ data });
}catch(err){
  if(postId===undefined)
  res.status(400).json({"message": "데이터 형식이 올바르지 않습니다."});
}
})
//댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  
  try{const {commentId} = req.params;
  const {password,content} = req.body;
  const [existsComments] = await Comments.find({ _id: commentId });
  if(content===undefined){

  res.status(400).json({"message": '댓글의 내용을 입력해주세요.'});
  }else if(existsComments===undefined){
  res.status(404).json({"message": '댓글 조회에 실패했습니다.'});
  }else if(existsComments.password !== password){ //비번 틀렸을 경우
  res.status(400).json({"message": '비밀번호가 틀렸습니다.'});
  }else{
  await Comments.updateOne({_id: commentId},{$set: {password,content}})
  res.json({ "message": "댓글을 수정하였습니다."});
  }
  }catch(err){
  res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.'});
  }
  
})
//댓글 삭제
router.delete('/comments/:commentId',async(req,res)=>{
try{
  const {commentId} = req.params;
  const {password} = req.body;
  const [existsComments] = await Comments.find({ _id:commentId });

  if(password===undefined){   //비번이 바디에 없을 경우
    res.status(400).json({"message": '비밀번호를 입력해주세요.'});
  }else if(existsComments===undefined){  //받은 파람스 조회 실패
    res.status(404).json({"message": '게시글 조회에 실패했습니다.'});
  }else if(existsComments.password !== password) //비번 틀렸을 경우
  res.status(400).json({"message": '비밀번호가 틀렸습니다.'});
  else  {
    await Comments.deleteOne({_id: commentId})
    res.json({ "message": '게시글을 삭제하였습니다.'});
  }
  }catch(err){
    res.status(400).json({"message": '데이터 형식이 올바르지 않습니다.'});
  }
})


module.exports = router;