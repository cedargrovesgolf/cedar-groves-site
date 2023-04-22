/* form-control.js */
$('.needs-validation').each(function () {
  var form = $(this);
  form.submit(function (event) {
    if (!form[0].checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.addClass('was-validated');
  });
});

$('.contact.needs-validation').each(function () {
  var form = $(this);
  form.submit(function (event) {
    var email = form.find('input[type="email"]');
    if (!form[0].checkValidity()) {
      if (email.val().length !== 0) {
        email.next('.invalid-feedback').text('Email address is invalid.');
      }
      event.preventDefault();
      event.stopPropagation();
    }
    form.addClass('was-validated');
  });
});
