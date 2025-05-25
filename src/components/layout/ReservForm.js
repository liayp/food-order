// pages/index.js
import Header from 'layout/Header';

export default function Home() {
  return (
    <div className="center">
      <div className="tickets">
        <div className="ticket-selector">
          <div className="head">
            <div className="title">Movie Name</div>
          </div>
          <div className="seats">
            <div className="status">
              <div className="item">Available</div>
              <div className="item">Booked</div>
              <div className="item">Selected</div>
            </div>
            <div className="all-seats">
              {/* ... Kode untuk membuat kursi */}
            </div>
          </div>
          <div className="timings">
            {/* ... Kode untuk pemilihan tanggal dan waktu */}
          </div>
        </div>
        <div className="price">
          <div className="total">
            <span>
              <span className="count">0</span> Tickets
            </span>
            <div className="amount">0</div>
          </div>
          <button type="button">Book</button>
        </div>
      </div>
    </div>
  );
}
