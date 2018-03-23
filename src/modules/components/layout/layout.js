/* eslint-disable */
import React from 'react';


export const Layout = (props) => {
    return (
        <div className={'container'}>
            <div className={'row header'}>
                header
            </div>
            <div className={'col-md-3'}>
                left nav
            </div>
            <div className={'col-md-9'}>
                content
            </div>

        </div>
    );
};

Layout.propTypes = {


};