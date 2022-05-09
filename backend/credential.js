register() {
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

    var url =
      "http://wifiticket.wifinetcom.net:8080/WIFITicketSystem2/TicketServlet?action=get_ticket_sms&pin=" +
      this.webSurfer.pin +
      "&nome=" +
      this.webSurfer.firstName +
      "&cognome=" +
      this.webSurfer.lastName +
      "&phone=" +
      this.webSurfer.phone +
      "&email=" +
      this.webSurfer.email +
      "&days=" +
      this.webSurfer.days;
    axios
      .post(url, {})
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // eseguito sempre
      });
  };
