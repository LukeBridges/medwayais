<template>
    <div id="copyrightdisclaimer">
        <div id="copyright">
            <dl>
                <dt><span id="scripttitle">based on "Live Ship Movements - ShipPlotter Sharing" by</span></dt>
                <span id="dv">D!V</span> - DigImage Visions<br/>
                W. Curt Deegan<br/>
                Boca Raton, Florida, USA<br/>
                Email: wwwr (at) earthlink (dot) net
            </dl>
        </div>
        <div id="disclaimer">
            <span>Disclaimer:</span>&nbsp;
            The information contained herein is intended for entertainment purposes only.<br/>
            No representation as to its accuracy is made or implied.<br/>
            This information SHOULD NOT be used for navigational purposes.
        </div>
    </div>
</template>

<script>
  export default {
    name: 'CopyrightDisclaimer',
  }
</script>

<style scoped>
    #copyrightdisclaimer {
        margin: 8px;
    }

    #copyright {
        text-align: right;
        font-weight: 700;
        font-style: italic;
        font-size: 12px;
    }

    #scripttitle {
        font-weight: 700;
        font-size: 18px
    }

    #dv {
        font-weight: 700;
        font-style: italic;
        font-size: 18px
    }

    #disclaimer {
        font-size: small;
        color: #000;
        text-align: center;
        margin: auto;
        border: 1px dashed black;
        width: 500px;
    }

    #disclaimer span {
        text-decoration: underline;
        font-size: 16px
    }
</style>
