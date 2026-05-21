async function test() {
  try {
    const res = await fetch('https://kitchenstoveao.vercel.app/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        txnid: "TXN17792280244546030"
      })
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
