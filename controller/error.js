exports.pageNotFound =(req, res, next)=>{
  res.status(404).render('404', { pageTitle: 'Error Page', currentPage: 'Error Page', isLoggedIn: req.session.isLoggedIn, user: req.session.user,})
}