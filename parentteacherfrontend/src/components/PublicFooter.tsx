import React from "react";

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <p>
        © {new Date().getFullYear()} Parent-Teacher Portal. All rights reserved.
      </p>
    </footer>
  );
};

export default PublicFooter;
