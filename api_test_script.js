```javascript
pm.test("Validate filtered data", function () {
    const responseData = pm.response.json();
    const data = pm.response.json().data;
    pm.expect(data).to.be.an('array');

    data.forEach(function (item) {
        pm.expect(item).to.have.property('incidentId');
        pm.expect(item).to.have.property('incidentTime');
        pm.expect(item).to.have.property('licensePlateNumber');
        pm.expect(item).to.have.property('displayImageUrl');
        pm.expect(item).to.have.property('distanceInMeters');
        pm.expect(item).to.have.property('violationCount');
        pm.expect(item).to.have.property('totalFineAmount');

        pm.expect(item.incidentTime).to.be.a('string').and.to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/);
        const incTime = item.incidentTime.toString().split('T')[0];
        const fromTime = pm.request.url.query.get('fromDate').toString().split('T')[0];
        const toTime = pm.request.url.query.get('toDate').toString().split('T')[0];

        pm.expect(Date.parse(incTime)).lessThan(Date.parse(toTime)).greaterThan(Date.parse(fromTime));

        pm.expect(item.licensePlateNumber).to.be.a('string');
        pm.expect(item.displayImageUrl).to.be.a('string').and.to.not.be.empty;
        pm.expect(item.distanceInMeters).to.be.a('number').and.to.be.below(100000);
        pm.expect(item.violationCount).to.be.a('number');
        pm.expect(item.totalFineAmount).to.be.a('number');
    });

    pm.expect(responseData).to.have.property('httpStatusCode', "OK");
    pm.expect(responseData).to.have.property('responseCode', 200);
    pm.expect(responseData).to.have.property('message').to.be.equal("Successfully fetched the violation data");
});
