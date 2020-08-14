const logger = require('../../helper/logger');
const { v4: uuidv4 } = require('uuid');
const FS = require('fs');
const Axios = require('axios');

const Default = {
    ext: "unknown",
    filename: "filename"
}

const downloadFile = async (url, filename, ext) => {
    const _filename = `${filename || uuidv4()}.${ext}`;
    const path = `/tmp/${_filename}`;
    const writer = FS.createWriteStream(path);

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            logger.info('File Download Success');
            logger.info(FS.existsSync(path));
            resolve(path);
        });

        writer.on('error', () => {
            logger.error('File Download Error');
            logger.error(err);
            process.exit();
        });
    })
}

const run = async (lane, job) => {
    logger.info('📩 Download File...');

    let { ext = Default.ext, filename = Default.filename, url } = job.options;

    const _filename = await downloadFile(url, filename, ext);
    process.env.BL_DOWNLOADED_FILE = _filename;
};

const validator = (lane, job) => {
    const doc = 'Please check documentaion. https://github.com/betalane/betalane#doa_s3---distribute-on-the-air-using-aws-s3';
    let { url } = job.options;

    if (!url) {
        return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'url' is missing. ${doc}` };
    }
    return true;
};


module.exports = { run, validator };
