/**
 * UTILIZES python-tools/deserialize.py TO CONVERT A GIVEN .unity3d TextAsset FILE TO .db
 * READ THE COMMENTS OF deserialize.py TO SEE THE REQUIRED DEPENDENCIES
 *
 * @param {string}    import_path    PATH OF .unity3d FILE
 * @param {string}    export_path    PATH TO EXPORT THE .db FILE TO
 * @return {Promise<any>}
 */
function deserialize_unity3d(import_path, export_path) {
    const py_file = 'python-tools/deserialize.py',
        options = { args: [import_path, export_path] };
    return run_python(py_file, options);
}

/**
 * RUN A PYTHON FILE USING python-shell
 *
 * @param {string}     py_file    PATH TO THE PYTHON FILE TO RUN
 * @param {object}     options    PARAMETERS TO USE WITH THE PYTHON FILE
 * @param {boolean}    silent     TRUE IF PYTHON CONSOLE OUTPUT MUST NOT BE DISPLAYED
 * @return {Promise<any>}
 */
function run_python(py_file, options, silent = false) {
    return new Promise(async function(resolve) {
        const { PythonShell } = require('python-shell');
        await PythonShell.run(py_file, options, function(err, results) {
            if (err) throw err;
            if (!silent) {
                for (let i of results) {
                    console.log('[' + py_file + ']', i);
                }
            }
            resolve();
        });
    });
}

module.exports.deserialize = deserialize_unity3d;