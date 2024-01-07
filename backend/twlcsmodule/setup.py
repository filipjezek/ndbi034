from setuptools import Extension, setup
from pathlib import Path

setup(
    ext_modules=[
        Extension(
            name="twlcs",
            sources=["twlcsmodule.c"],
            include_dirs=[
                str((Path(__file__) / "../../../.venv/Lib/site-packages/numpy/core/include").resolve())
            ]
        )
    ]
)